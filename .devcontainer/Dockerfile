FROM mcr.microsoft.com/playwright:v1.57.0-jammy

SHELL ["/bin/bash", "-lc"]

RUN apt-get update && apt-get install -y \
	fish \
	&& apt-get clean && rm -rf /var/lib/apt/lists/*

RUN if id -u pwuser >/dev/null 2>&1; then chsh -s /usr/bin/fish pwuser || true; fi

WORKDIR /workspace
