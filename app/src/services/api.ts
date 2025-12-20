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
    name: string;
    symbol?: string;
    bidding_start_date?: string;
    bidding_end_date?: string;
    listing_date?: string;
    min_price?: string;
    max_price?: string;
    issue_price?: string;
    listing_gains?: string;
    listing_price?: string;
    lot_size?: string;
    status: string;
    is_sme?: boolean;
    additional_text?: string;
    document_url?: string;
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

export const getIPOs = async (): Promise<IPO[]> => {
    try {
        const response = await api.get('/get_ipos.php');
        return response.data;
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
