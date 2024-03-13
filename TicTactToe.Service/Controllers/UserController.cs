
using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using TicTactToe.Service.Context;
using TicTactToe.Service.Helpers;
using TicTactToe.Service.Models;
using TicTactToe.Service.Models.Dtos;
using TicTactToe.Service.Services;

namespace TicTactToe.Service.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly TicTactToeDbContext _dbContext;
    private readonly UserConnectionService _userConnectionService;

    public UserController(TicTactToeDbContext dbContext, UserConnectionService userConnectionService)
    {
        _dbContext = dbContext;
        _userConnectionService = userConnectionService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] User userObj)
    {
        if (userObj == null) return BadRequest();

        // check user is inside the bd
        var user = await _dbContext.Users.FirstOrDefaultAsync(user => user.Username == userObj.Username);
        if (user == null) return NotFound(new { message = "User Not Found!!" });

        // check the password
        if (!PasswordHasher.VerifyPassword(userObj.Password, user.Password))
            return NotFound(new { message = "Password is Incorrect!" });

        _userConnectionService.AddUserToList(user.Username);

        user.Token = CreateJwt(user);
        var newAccesToken = user.Token;
        var newRefreshToken = CreateRefershToken();
        user.RefreshToken = newRefreshToken;
        user.RefreshTokenExpiryTime = DateTime.Now.AddDays(5);

        await _dbContext.SaveChangesAsync();

        return Ok(new TokenDto()
        {
            AccessToken = newAccesToken,
            RefreshToken = newRefreshToken
        });
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] User userObj)
    {
        if (userObj == null) return BadRequest();

        if ((userObj.Username == null) || (userObj.Password == null)) BadRequest(new { message = "username and password canot be empty!" });

        // Check Username already in the db
        var user = await _dbContext.Users.AnyAsync(user => user.Username == userObj.Username);
        if (user) return BadRequest(new { message = "User name Already Exist!!" });

        // check password strength
        var passwordMsg = CheckPasswordStrength(userObj.Password);
        if (!string.IsNullOrEmpty(passwordMsg)) return BadRequest(new { message = passwordMsg });

        // password encription (Hash password)
        userObj.Password = PasswordHasher.HashPassword(userObj.Password);

        await _dbContext.Users.AddAsync(userObj);
        await _dbContext.SaveChangesAsync();
        return Ok(new { message = "Register Success!!" });
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh([FromBody] TokenDto tokenDto)
    {
        if (tokenDto == null) return BadRequest(new { message = "Invalid Client Request" });

        string accessToken = tokenDto.AccessToken;
        string refershToken = tokenDto.RefreshToken;

        // Need to validate tokens
        var principle = GetPrincipleFromExpiredToken(accessToken);

        var username = principle.Identity.Name;

        var user = await _dbContext.Users.FirstOrDefaultAsync(user => user.Username == username);
        if(user == null || user.RefreshToken != refershToken || user.RefreshTokenExpiryTime <= DateTime.Now) 
            return BadRequest("Invalid Request");

        var newAccesToken = CreateJwt(user);
        var newRefreshToken = CreateRefershToken();
        user.Token = newAccesToken;
        user.RefreshToken = newRefreshToken;
        user.RefreshTokenExpiryTime = DateTime.Now.AddDays(5);

        await _dbContext.SaveChangesAsync();

        return Ok(new TokenDto(){
            AccessToken = newAccesToken,
            RefreshToken = newRefreshToken
        });
    }

    private ClaimsPrincipal GetPrincipleFromExpiredToken(string token)
    {
        var tokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes("veryverysecretveryverysecretveryverysecretveryverysecret")),
            ValidateAudience = false,
            ValidateIssuer = false,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        SecurityToken securityToken;
        var principle = tokenHandler.ValidateToken(token, tokenValidationParameters, out securityToken);

        var jwtSecurityToken = securityToken as JwtSecurityToken;
        
        if(jwtSecurityToken == null || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCulture))
        {
            throw new SecurityTokenException("This is Invalid Token");
        }

        return principle;
    }

    private string CheckPasswordStrength(string password)
    {
        StringBuilder sb = new StringBuilder();

        if (password.Length < 8)
            sb.Append("Minimum password length should be 8" + Environment.NewLine);
        if (!(Regex.IsMatch(password, "[a-z]") && Regex.IsMatch(password, "[A-Z]") && Regex.IsMatch(password, "[0-9]")))
            sb.Append("Password should be Alphanumatic" + Environment.NewLine);
        if (!Regex.IsMatch(password, "[<,>,!,#,%,~,_,+,=,@,*]"))
            sb.Append("Password should contain special chars of <,>,!,#,%,~,_,+,=,@,*" + Environment.NewLine);

        return sb.ToString();
    }

    private string CreateJwt(User user)
    {
        var jwtTokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes("veryverysecretveryverysecretveryverysecretveryverysecret");

        var identity = new ClaimsIdentity(new Claim[]{
            new Claim(ClaimTypes.Name, $"{user.Username}")
        });

        var credentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = identity,
            Expires = DateTime.Now.AddDays(1),
            // Expires = DateTime.Now.AddSeconds(10),
            SigningCredentials = credentials
        };

        var token = jwtTokenHandler.CreateToken(tokenDescriptor);
        return jwtTokenHandler.WriteToken(token);
    }

    private string CreateRefershToken()
    {
        var tokenGenerator = RandomNumberGenerator.GetBytes(64);
        var refershToken = Convert.ToBase64String(tokenGenerator);
        var tokenInUser = _dbContext.Users.Any(user => user.RefreshToken == refershToken);
        if (tokenInUser) // avoid same token
        {
            return CreateRefershToken();
        }
        return refershToken;
    }
}