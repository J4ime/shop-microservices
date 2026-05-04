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

# Datadog .NET Tracer
ARG DD_TRACER_VERSION=3.14.0
RUN mkdir -p /opt/datadog \
    && curl -sSL https://github.com/DataDog/dd-trace-dotnet/releases/download/v${DD_TRACER_VERSION}/datadog-dotnet-apm-${DD_TRACER_VERSION}.tar.gz \
       -o /tmp/dd-trace.tar.gz \
    && tar -xzf /tmp/dd-trace.tar.gz -C /opt/datadog \
    && rm /tmp/dd-trace.tar.gz

COPY --from=build /app .
ENTRYPOINT ["dotnet", "Auth.Api.dll"]
