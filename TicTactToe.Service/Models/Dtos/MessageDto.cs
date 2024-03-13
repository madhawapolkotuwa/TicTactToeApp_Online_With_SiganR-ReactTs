
namespace TicTactToe.Service.Models.Dtos;

public class MessageDto
{
    public string? From {get;set;}
    public string? To {get;set;}
    public string? Content {get;set;}
}

public class PrivateMessageDto
{
    public string? From {get;set;}
    public string? To {get;set;}
    public int Position {get;set;}
}