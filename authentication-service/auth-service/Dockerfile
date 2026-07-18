FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["auth-service.sln", "./"]
COPY ["src/AuthService.Domain/AuthService.Domain.csproj", "src/AuthService.Domain/"]
COPY ["src/AuthService.Persistence/AuthService.Persistence.csproj", "src/AuthService.Persistence/"]
COPY ["src/AuthService.Application/AuthService.Application.csproj", "src/AuthService.Application/"]
COPY ["src/AuthService.Api/AuthService.Api.csproj", "src/AuthService.Api/"]

RUN dotnet restore "auth-service.sln"

COPY . .
WORKDIR "/src/src/AuthService.Api"
RUN dotnet build "AuthService.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "AuthService.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

# Render inyecta PORT; el entrypoint escucha en ese puerto.
EXPOSE 8080
ENV ASPNETCORE_ENVIRONMENT=Production

ENTRYPOINT ["/app/docker-entrypoint.sh"]
