# Deep Link Configuration Guide

## 1. Upload Domain Verification Files

### For iOS (apple-app-site-association):
Upload the `apple-app-site-association` file to:
- https://go.getgosim.com/.well-known/apple-app-site-association

### For Android (assetlinks.json):
Upload the `assetlinks.json` file to:
- https://go.getgosim.com/.well-known/assetlinks.json

## 2. Android Configuration

Add to `android/app/src/main/AndroidManifest.xml` inside the <activity> tag:

```xml
<!-- Deep Link Intent Filters -->
<intent-filter android:autoVerify="true">
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="https" android:host="go.getgosim.com" />
</intent-filter>

<intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="gosim" />
</intent-filter>
```

## 3. iOS Configuration

### In Xcode:
1. Open ios/App/App.xcworkspace
2. Select your app target
3. Go to "Signing & Capabilities" 
4. Add "Associated Domains" capability
5. Add domain: `applinks:go.getgosim.com`

### Or add to ios/App/App/App.entitlements:
```xml
<key>com.apple.developer.associated-domains</key>
<array>
    <string>applinks:go.getgosim.com</string>
</array>
```

## 4. Generate Android Key Signature

Run these commands to get your SHA256 fingerprint:

```bash
# Generate keystore (if you dont have one)
keytool -genkey -v -keystore gosim-release-key.keystore -alias gosim -keyalg RSA -keysize 2048 -validity 10000

# Get SHA256 fingerprint
keytool -list -v -keystore gosim-release-key.keystore
```

Copy the SHA256 fingerprint and replace "YOUR_SHA256_FINGERPRINT_HERE" in assetlinks.json

## 5. Replace YOUR_TEAM_ID

Replace "YOURTEAMID" in apple-app-site-association with your actual iOS Team ID from Apple Developer account.

## 6. Test URLs

After setup, these URLs should open your app:
- https://go.getgosim.com/success?order_id=123
- https://go.getgosim.com/failure?error=payment_failed
- gosim://success?order_id=123
- gosim://failure?error=payment_failed

## 7. Verification Tools

### iOS:
- https://search.developer.apple.com/appsearch-validation-tool/
- Enter: https://go.getgosim.com/.well-known/apple-app-site-association

### Android:
- https://developers.google.com/digital-asset-links/tools/generator
- Enter your domain and app details

