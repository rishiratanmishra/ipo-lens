import axios from 'axios';

// For Android Emulator, 10.0.2.2 points to localhost of the machine.
// For physical device, you need the actual IP of the machine (e.g., http://192.168.1.5/backend/api).
// Update this URL based on your testing environment.
const BASE_URL = 'https://zolaha.com/ipo_app/backend_ipo/api'; 

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
});

export interface IPO {
    id: number;
    name: string;
    is_sme: number; // 0 or 1
    open_date: string;
    close_date: string;
    price_band: string;
    min_price: number;
    max_price: number;
    lot_size: number;
    issue_size_cr: string;
    premium: string;
    badge: string;
    allotment_date: string;
    listing_date: string;
    status: string;
    icon_url: string;
    slug: string;
    // Legacy/Optional fields (mapped or kept for compatibility if needed)
    symbol?: string;
    document_url?: string;
    gmp_price?: string; // Derived from premium?
    trend?: string;
}

export interface Buyback {
    id: string;
    company_name: string;
    company?: string; // key from WP API
    offer_price?: string;
    buyback_price?: string;
    type?: string;
    status: string;
    logo?: string;
    record_date?: string;
    current_market_price?: string;
}

export interface Broker {
    id: string;
    name: string; // mapped from 'title' in API or keep as name if API sends title
    title: string;
    logo: string;
    affiliate_link: string;
    referral_code: string;
    rating: number;
    min_deposit: string;
    fees: string;
    pros: string[];
    cons: string[];
    is_featured: boolean;
    categories: string[];
}

export const getIPOs = async (status?: string, is_sme?: number, page: number = 1, limit: number = 20): Promise<{ ipos: IPO[], pagination: any }> => {
    try {
        const endpoint = is_sme === 1 ? '/get_sme_ipos.php' : '/get_ipos.php';
        
        const response = await api.get(endpoint, {
            params: { page, limit } 
        });
        
        const data = response.data;
        const pagination = data.pagination || {};

        // If a specific status is requested, we filter locally from the returned groups ??
        // Actually the backend returns ALL groups paginated.
        // If we want "OPEN", we pick data.OPEN.
        
        let result: IPO[] = [];

        if (status) {
            // "OPEN", "UPCOMING", "CLOSED"
            const key = status.toUpperCase();
            if (data[key]) {
                result = data[key];
            }
        } else {
            // Flatten all
            result = [
                ...(data.OPEN || []),
                ...(data.UPCOMING || []),
                ...(data.CLOSED || [])
            ];
        }

        return {
            ipos: result,
            pagination
        };

    } catch (error) {
        console.error("Error fetching IPOs:", error);
        return { ipos: [], pagination: {} };
    }
};

export const getBuybacks = async (): Promise<Buyback[]> => {
    try {
        const response = await api.get('/get_buybacks.php');
        const data = response.data;
        
        // The API now returns { OPEN: [], UPCOMING: [], CLOSED: [] }
        // Flatten into a single array for the UI
        return [
            ...(data.OPEN || []),
            ...(data.UPCOMING || []),
            ...(data.CLOSED || [])
        ];
    } catch (error) {
        console.error("Error fetching Buybacks:", error);
        return [];
    }
};

export const getBrokers = async (): Promise<Broker[]> => {
    try {
        const response = await api.get('/get_brokers.php');
        return response.data;
    } catch (error) {
        console.error("Error fetching Brokers:", error);
        return [];
    }
};

export const getGMPTrends = async (
    page: number = 1,
    limit: number = 20,
    is_sme?: number,
    status?: string,
    minPremium: number = 1,
    maxPremium?: number,
    sort: 'date' | 'gmp_high' | 'gmp_low' = 'gmp_high' // Default to top gainers
): Promise<{ ipos: IPO[], pagination: any }> => {
    try {
        const response = await api.get('/get_gmp_trends.php', {
            params: { 
                page, 
                limit, 
                is_sme, 
                status: status || undefined,
                min_premium: minPremium,
                max_premium: maxPremium,
                sort
            }
        });
        
        // Transform data to ensure prices are numbers
        const ipos = (response.data.gmp_trends || []).map((ipo: any) => ({
            ...ipo,
            min_price: parseFloat(ipo.min_price) || 0,
            max_price: parseFloat(ipo.max_price) || 0,
        }));

        return {
            ipos,
            pagination: response.data.pagination || {}
        };
    } catch (error) {
        console.error("Error fetching GMP trends:", error);
        return { ipos: [], pagination: {} };
    }
};

export interface MarketIndex {
    name: string;
    value: string;
    change: string;
    percentChange: string;
    isUp: boolean;
    lastUpdated: string;
}

export const getMarketIndices = async (): Promise<{ nifty: MarketIndex, sensex: MarketIndex, banknifty: MarketIndex }> => {
    try {
        // Yahoo Finance Symbols: ^NSEI (Nifty 50), ^BSESN (Sensex), ^NSEBANK (Nifty Bank)
        const symbols = ['^NSEI', '^BSESN', '^NSEBANK'];
        const requests = symbols.map(symbol => 
            axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`)
        );

        const responses = await Promise.all(requests);

        const formatData = (data: any, name: string): MarketIndex => {
            const result = data.chart.result[0];
            const meta = result.meta;
            const price = meta.regularMarketPrice;
            const prevClose = meta.chartPreviousClose;
            const change = price - prevClose;
            const percentChange = (change / prevClose) * 100;
            const time = new Date(meta.regularMarketTime * 1000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

            return {
                name,
                value: price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                change: Math.abs(change).toFixed(2),
                percentChange: Math.abs(percentChange).toFixed(2) + '%',
                isUp: change >= 0,
                lastUpdated: time
            };
        };

        return {
            nifty: formatData(responses[0].data, 'NIFTY 50'),
            sensex: formatData(responses[1].data, 'SENSEX'),
            banknifty: formatData(responses[2].data, 'BANKNIFTY')
        };
    } catch (error) {
        console.error("Error fetching market indices:", error);
        // Return fallback/mock data if fails
        const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
        return {
            nifty: { name: 'NIFTY 50', value: '24,142.50', change: '80.50', percentChange: '0.4%', isUp: true, lastUpdated: time },
            sensex: { name: 'SENSEX', value: '79,500.20', change: '250.20', percentChange: '0.3%', isUp: true, lastUpdated: time },
            banknifty: { name: 'BANKNIFTY', value: '51,200.50', change: '150.80', percentChange: '0.3%', isUp: true, lastUpdated: time }
        };
    }
};

// IPO Details Interface matching the backend scraper response
export interface IPODetails {
    ipo_name: string;
    dates: string;
    image: string;
    basic_details: { [key: string]: string };
    documents: { title: string; url: string }[];
    application_breakup: { [key: string]: string }[];
    subscription_demand: { [key: string]: string }[];
    subscription: { [key: string]: string }[];
    qib_interest: string[];
    lot_distribution: { [key: string]: string }[];
    reservation: { [key: string]: string }[];
    ipo_details: { [key: string]: string };
    kpi: { [key: string]: string }[];
    peer_valuation: { [key: string]: string }[];
    peer_financials: { [key: string]: string }[];
    about_company: string;
    lead_managers: { name: string }[];
    address: string;
    registrar: string;
}

export const getIPODetails = async (id: number): Promise<IPODetails | null> => {
    try {
        const response = await api.get('/get_ipo_details.php', {
            params: { id }
        });
        
        // Backend returns error object if failed
        if (response.data.status === 'error' || response.data.error) {
            console.error("API Error:", response.data.message || response.data.error);
            return null;
        }

        return response.data;
    } catch (error) {
        console.error("Error fetching IPO Details:", error);
        return null;
    }
};

export default api;

