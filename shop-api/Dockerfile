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

# Datadog .NET Tracer
ARG DD_TRACER_VERSION=3.14.0
RUN mkdir -p /opt/datadog \
    && curl -sSL https://github.com/DataDog/dd-trace-dotnet/releases/download/v${DD_TRACER_VERSION}/datadog-dotnet-apm-${DD_TRACER_VERSION}.tar.gz \
       -o /tmp/dd-trace.tar.gz \
    && tar -xzf /tmp/dd-trace.tar.gz -C /opt/datadog \
    && rm /tmp/dd-trace.tar.gz

COPY --from=build /app .
ENTRYPOINT ["dotnet", "Shop.Api.dll"]
