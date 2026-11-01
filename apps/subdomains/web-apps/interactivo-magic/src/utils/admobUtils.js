import { AdMob, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';
import { isNativePlatform } from './platformUtils';
import { ADMOB_CONFIG, USE_TEST_ADS, getAdId } from '../config/admobConfig';

/**
 * Initialize AdMob SDK
 */
export const initializeAdMob = async () => {
    if (!isNativePlatform()) return;

    try {
        await AdMob.initialize({
            requestTrackingAuthorization: true,
            testingDevices: USE_TEST_ADS ? ['YOUR_DEVICE_ID_HERE'] : [],
            initializeForTesting: USE_TEST_ADS,
        });
        console.log(`AdMob: Initialized (${USE_TEST_ADS ? 'TEST' : 'PROD'})`);
    } catch (error) {
        console.error('AdMob: Initialization error:', error);
    }
};

/**
 * Show banner ad at bottom of screen
 */
export const showBannerAd = async () => {
    if (!isNativePlatform()) return;

    try {
        const options = {
            adId: getAdId('BANNER'),
            adSize: BannerAdSize.BANNER,
            position: BannerAdPosition.BOTTOM_CENTER,
            margin: 0,
            isTesting: USE_TEST_ADS,
        };

        await AdMob.showBanner(options);
        console.log('AdMob: Banner shown');
    } catch (error) {
        console.error('AdMob: Error showing banner:', error);
    }
};

/**
 * Hide banner ad
 */
export const hideBannerAd = async () => {
    if (!isNativePlatform()) return;
    try {
        await AdMob.hideBanner();
    } catch (error) {
        console.error('AdMob: Error hiding banner:', error);
    }
};

// Track ad state
let isRewardedAdPreparing = false;
let isRewardedAdReady = false;

/**
 * Pre-load a rewarded interstitial ad
 */
export const prepareRewardedAd = async () => {
    if (!isNativePlatform() || isRewardedAdPreparing || isRewardedAdReady) return;

    try {
        isRewardedAdPreparing = true;
        const options = {
            adId: getAdId('REWARDED_INTERSTITIAL'),
            isTesting: USE_TEST_ADS,
        };

        console.log(`AdMob: Pre-loading Rewarded Interstitial (${options.adId})...`);

        // Use specific method
        if (typeof AdMob.prepareRewardedInterstitialAd === 'function') {
            await AdMob.prepareRewardedInterstitialAd(options);
        } else {
            await AdMob.prepareRewardVideoAd(options);
        }

        // Listeners for load state
        const loadListener = await AdMob.addListener('onRewardedInterstitialAdLoaded', () => {
            console.log('AdMob: Rewarded Interstitial LOADED');
            isRewardedAdReady = true;
            isRewardedAdPreparing = false;
            loadListener.remove();
        });

        const failListener = await AdMob.addListener('onRewardedInterstitialAdFailedToLoad', (error) => {
            console.error('AdMob: Rewarded Interstitial FAILED TO LOAD', error);
            isRewardedAdReady = false;
            isRewardedAdPreparing = false;
            failListener.remove();
        });

        const rvLoadListener = await AdMob.addListener('onRewardedVideoAdLoaded', () => {
            console.log('AdMob: Ad Loaded (RV fallback)');
            isRewardedAdReady = true;
            isRewardedAdPreparing = false;
            rvLoadListener.remove();
        });

    } catch (error) {
        console.error('AdMob: Error preparing ad:', error);
        isRewardedAdPreparing = false;
        isRewardedAdReady = false;
    }
};

/**
 * Show the pre-loaded rewarded interstitial ad
 */
export const showRewardedAd = async (onReward) => {
    if (!isNativePlatform()) {
        if (onReward) onReward();
        return true;
    }

    try {
        // Silent wait for up to 5 seconds if not ready (forced priority)
        if (!isRewardedAdReady) {
            console.log('AdMob: Waiting for Rewarded ad (forced priority)...');
            await prepareRewardedAd();
            let attempts = 0;
            while (!isRewardedAdReady && attempts < 50) { // Up to 5 seconds
                await new Promise(r => setTimeout(r, 100));
                attempts++;
            }
        }

        if (!isRewardedAdReady) {
            console.warn('AdMob: Rewarded NOT ready, launching Interstitial fallback...');
            await showInterstitial();
            if (onReward) onReward();
            return true;
        }

        let rewarded = false;

        // Reward listeners
        const rewardListener = await AdMob.addListener('onRewardedVideoAdRewarded', (reward) => {
            rewarded = true;
            if (onReward) onReward(reward);
        });

        const riRewardListener = await AdMob.addListener('onRewardedInterstitialAdRewardReceived', (reward) => {
            rewarded = true;
            if (onReward) onReward(reward);
        });

        // Dismiss listeners
        const dismissListener = await AdMob.addListener('onRewardedVideoAdDismissed', () => {
            isRewardedAdReady = false;
            cleanup();
            prepareRewardedAd();
        });

        const riDismissListener = await AdMob.addListener('onRewardedInterstitialAdDismissed', () => {
            isRewardedAdReady = false;
            cleanup();
            prepareRewardedAd();
        });

        const cleanup = () => {
            rewardListener.remove();
            riRewardListener.remove();
            dismissListener.remove();
            riDismissListener.remove();
        };

        // Show
        if (typeof AdMob.showRewardedInterstitialAd === 'function') {
            await AdMob.showRewardedInterstitialAd();
        } else {
            await AdMob.showRewardVideoAd();
        }

        return true;
    } catch (error) {
        console.error('AdMob: Error showing ad:', error);
        isRewardedAdReady = false;
        if (onReward) onReward();
        return false;
    }
};

/**
 * Show standard interstitial ad
 */
export const showInterstitial = async () => {
    if (!isNativePlatform()) return;
    try {
        const options = {
            adId: getAdId('INTERSTITIAL'),
            isTesting: USE_TEST_ADS,
        };
        await AdMob.prepareInterstitial(options);
        await AdMob.showInterstitial();
    } catch (error) {
        console.error('AdMob: Error showing interstitial:', error);
    }
};

/**
 * Check AdMob availability
 */
export const isAdMobAvailable = () => isNativePlatform();
