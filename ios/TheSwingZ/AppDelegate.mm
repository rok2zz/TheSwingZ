#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import "RNSplashScreen.h"
#import <RNKakaoLogins.h>
#import <NaverThirdPartyLogin/NaverThirdPartyLoginConnection.h>
#import <GoogleSignIn/GoogleSignIn.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)app
     openURL:(NSURL *)url
     options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {

      // naver
      if ([url.scheme isEqualToString:@"{{ CUSTOM URL SCHEME }}"]) {
        return [[NaverThirdPartyLoginConnection getSharedInstance] application:app openURL:url options:options];
      }
      // kakao
      if([RNKakaoLogins isKakaoTalkLoginUrl:url]) {
          return [RNKakaoLogins handleOpenUrl: url];
      }
 return NO;
}

// // google
// - (BOOL)application:(UIApplication *)application openURL:(nonnull NSURL *)url options:(nonnull NSDictionary<NSString *,id> *)options {
//   return [[FBSDKApplicationDelegate sharedInstance] application:application openURL:url options:options] || [GIDSignIn.sharedInstance handleURL:url];
// }

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"TheSwingZ";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  [super application:application didFinishLaunchingWithOptions:launchOptions];
  [RNSplashScreen show];

  return YES;
}



- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self getBundleURL];
}

- (NSURL *)getBundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
