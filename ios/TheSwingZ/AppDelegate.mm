#import "AppDelegate.h"

// #import <GoogleSignIn/GoogleSignIn.h>
#import <React/RCTBundleURLProvider.h>
#import "RNSplashScreen.h"
#import <NaverThirdPartyLogin/NaverThirdPartyLoginConnection.h>
#import <React/RCTLinkingManager.h>
#import <RNCKakaoUser/RNCKakaoUserUtil.h>
#import <React/RCTLinkingManager.h>

@implementation AppDelegate

// kakao & naver login
- (BOOL)application:(UIApplication *)application
     openURL:(NSURL *)url
     options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {

      // naver
      if ([url.scheme isEqualToString:@"com.theswinggolf.theswingz"]) {
        return [[NaverThirdPartyLoginConnection getSharedInstance] application:application openURL:url options:options];
      }
      // kakao
      if([RNCKakaoUserUtil isKakaoTalkLoginUrl:url]) {
        return [RNCKakaoUserUtil handleOpenUrl:url];
      }
  return [RCTLinkingManager application:application openURL:url options:options];
}

// deep link
// - (BOOL)application:(UIApplication *)application
//    openURL:(NSURL *)url
//    options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
// {
//   return [RCTLinkingManager application:application openURL:url options:options];
// }

// universal link
// - (BOOL)application:(UIApplication *)application continueUserActivity:(nonnull NSUserActivity *)userActivity
//  restorationHandler:(nonnull void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler
// {
//  return [RCTLinkingManager application:application
//                   continueUserActivity:userActivity
//                     restorationHandler:restorationHandler];
// }

// google
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
