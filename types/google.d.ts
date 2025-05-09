interface Google {
    maps: any;
}

declare global {
    interface Window {
        google?: Google;
    }
} 