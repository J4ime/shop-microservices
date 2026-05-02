FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY Shop.Auth.sln ./
COPY Auth.Domain/Auth.Domain.csproj ./Auth.Domain/
COPY Auth.Infrastructure/Auth.Infrastructure.csproj ./Auth.Infrastructure/
COPY Auth.Api/Auth.Api.csproj ./Auth.Api/

RUN dotnet restore

COPY . .
RUN dotnet publish Auth.Api/Auth.Api.csproj -c Release -o /app

FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
EXPOSE 8080
COPY --from=build /app .
ENTRYPOINT ["dotnet", "Auth.Api.dll"]
