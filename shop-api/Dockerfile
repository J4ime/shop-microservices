FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY Shop.sln ./
COPY Shop.Domain/Shop.Domain.csproj ./Shop.Domain/
COPY Shop.Application/Shop.Application.csproj ./Shop.Application/
COPY Shop.Infrastructure/Shop.Infrastructure.csproj ./Shop.Infrastructure/
COPY Shop.Api/Shop.Api.csproj ./Shop.Api/
COPY Shop.UnitTests/Shop.UnitTests.csproj ./Shop.UnitTests/

RUN dotnet restore

COPY . .
RUN dotnet publish Shop.Api/Shop.Api.csproj -c Release -o /app

FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
EXPOSE 8080
EXPOSE 8081
COPY --from=build /app .
ENTRYPOINT ["dotnet", "Shop.Api.dll"]
