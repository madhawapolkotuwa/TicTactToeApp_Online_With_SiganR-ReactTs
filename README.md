
# Web Api Service
## Create .Net Web Api Appliction
    >> dotnet new webapi -controllers -n projectname
    >> cd projectname

## Add microsoft signalr package 
    >> dotnet add package Microsoft.AspNet.SignalR

## Add microsoft EntityFrameworkCore
    >> dotnet add package Microsoft.EntityFrameworkCore --version 8.0.0
    >> dotnet add package Microsoft.EntityFrameworkCore.Design --version 8.0.0

## Add microsoft sql sever packages
    >> dotnet add package Microsoft.EntityFrameworkCore.SqlServer --version 8.0.0
    >> dotnet add package Microsoft.EntityFrameworkCore.Tools --version 8.0.0

## Add dotnet-ef to local
    >> dotnet new tool-manifest
    >> dotnet tool install --local dotnet-ef --version 8.0.0

### Before do the migrations need to update project config
    <InvariantGlobalization>false</InvariantGlobalization>

## Add migrations to SQL database
    >> dotnet dotnet-ef migrations add InitialCreate
    if need remove migrations
    >> dotnet dotnet-ef migrations remove

## Update database (push migtations to database)
    >> dotnet dotnet-ef database update InitialCreate

## To create the JWTBearer Token
    >> dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer --version 8.0.0

# React Web Application

## Create React App
    >> npx create-react-app projectname
    >> cd projectname

## Install npm packages
    >> npm install react-bootstrap bootstrap
    >> npm install react-router-dom
    >> npm install @microsoft/signalr

## using Typescript
    >> npx create-react-app my-app --template typescript
    >> npm install --save typescript @types/node @types/react @types/react-dom @types/jest
    >> npm i react-bootstrap bootstrap
    >> npm i react-router-dom