# Fontory for iOS

This native SwiftUI shell lets you switch between both existing Fontory sites:

- https://softronics.run.place/
- https://m.softronics.run.place/

The web content remains hosted on the existing sites; this app does not copy or replace website/font data.

## Build unsigned IPA

Run the **Build Fontory iOS IPA** workflow from GitHub Actions. It uploads a `Fontory-unsigned-IPA` artifact. An unsigned IPA is not directly installable on a normal iPhone; it needs signing.

## Optional signed IPA

The **Sign Fontory iOS IPA** workflow expects repository Actions secrets:

- `IOS_CERTIFICATE_BASE64`: base64-encoded Apple distribution certificate (.p12)
- `IOS_CERTIFICATE_PASSWORD`: password for the .p12
- `IOS_PROVISIONING_PROFILE_BASE64`: base64-encoded Ad Hoc provisioning profile for bundle ID `run.softronics.fontory`
- `IOS_TEAM_ID`: Apple Developer Team ID

The provisioning profile name in the export configuration is `Fontory Ad Hoc`; update the workflow if the actual profile name differs. Ad Hoc installs are limited to devices registered in the profile. Never commit certificates, passwords, or profiles to the repository.
