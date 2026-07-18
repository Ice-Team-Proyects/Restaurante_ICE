#!/bin/sh
set -e

# Render (y otros PaaS) inyectan PORT. Si no existe, usar 5296.
PORT="${PORT:-5296}"
export ASPNETCORE_URLS="http://0.0.0.0:${PORT}"

exec dotnet AuthService.Api.dll
