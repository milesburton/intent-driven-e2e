# Security Policy

## Reporting a Vulnerability

Please do not open public issues for security vulnerabilities.

- Use GitHub Security Advisories to report privately:
  - https://docs.github.com/en/code-security/security-advisories
- Alternatively, open a private security report through the repository’s "Report a vulnerability" link if available.

Provide as much detail as possible:

- Affected version/commit and environment
- Steps to reproduce
- Potential impact and severity
- Suggested remediation, if known

We aim to acknowledge reports within 7 days and provide regular updates until resolution.

## Supported Versions

This project is a sample; we generally support the `main` branch. Please test against `main` when reporting issues.

## Additional Notes

- The Dev Container is for development convenience, not production security.
- OpenFin testing relies on a CDP connection; ensure you do not expose sensitive endpoints publicly when configuring remote debugging.
