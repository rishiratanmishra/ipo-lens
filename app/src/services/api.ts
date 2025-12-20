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
    id: string;
    company_name: string;
    symbol?: string;
    open_date?: string;
    close_date?: string;
    listing_date?: string;
    price_band_lower?: string;
    price_band_upper?: string;
    issue_price?: string;
    listing_gains?: string;
    listing_price?: string;
    lot_size?: string;
    status: string;
    is_sme?: boolean;
    additional_text?: string;
    document_url?: string;
    gmp_price?: string;
    trend?: string; // Optional, can be calculated or added later
}

export interface Buyback {
    id: string;
    company_name: string;
    // Add other fields as needed based on response
}

export interface Broker {
    id: string;
    name: string;
    // Add other fields as needed
}

export const getIPOs = async (status?: string, is_sme?: number): Promise<IPO[]> => {
    try {
        // The API returns { UPCOMING: [], OPEN: [], CLOSED: [], LISTED: [] }
        // We pass the status param to filter on the backend (optimization), 
        // but the response structure is always grouped.
        // Check if we need SME or Mainboard
        const endpoint = is_sme === 1 ? '/get_sme_ipos.php' : '/get_ipos.php';
        
        const response = await api.get(endpoint, {
            params: { status } // Backend handles filtering by status if provided
        });
        
        const data = response.data;
        
        // If a specific status is requested, return that array
        if (status && data[status]) {
            return data[status];
        } else if (status && !data[status]) {
            // Fallback if the key doesn't strictly match or is missing
             return [];
        }

        // If no status requested (or we want all), we might need to flatten
        // But HomeScreen typically requests one status at a time.
        // For safety, if no status, return all flattened.
        return [
            ...(data.OPEN || []),
            ...(data.UPCOMING || []),
            ...(data.LISTED || []),
            ...(data.CLOSED || [])
        ];

    } catch (error) {
        console.error("Error fetching IPOs:", error);
        return [];
    }
};

export const getBuybacks = async (): Promise<Buyback[]> => {
    try {
        const response = await api.get('/get_buybacks.php');
        return response.data;
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

export default api;
