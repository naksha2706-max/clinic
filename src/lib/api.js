import { supabase } from './supabase';

/**
 * Fetch all clinics from the database.
 * @returns {Promise<Array>} List of clinics
 */
export const getClinics = async () => {
    const { data, error } = await supabase
        .from('clinics')
        .select('*');

    if (error) throw error;
    return data;
};

/**
 * Fetch only emergency-capable clinics.
 * @returns {Promise<Array>} List of emergency clinics
 */
export const getEmergencyClinics = async () => {
    const { data, error } = await supabase
        .from('clinics')
        .select('*')
        .eq('is_emergency_capable', true);

    if (error) throw error;
    return data;
};

/**
 * Create a new booking.
 * @param {Object} bookingData - The booking details
 * @returns {Promise<Object>} The created booking
 */
export const createBooking = async (bookingData) => {
    const { data, error } = await supabase
        .from('bookings')
        .insert([bookingData])
        .select()
        .single();

    if (error) throw error;
    return data;
};

/**
 * Save an interaction log for a booking.
 * @param {Object} logData - The log details (booking_id, transcript, etc.)
 */
export const saveInteractionLog = async (logData) => {
    const { data, error } = await supabase
        .from('interaction_logs')
        .insert([logData])
        .select()
        .single();

    if (error) throw error;
    return data;
};

/**
 * Fetch all bookings with clinic details.
 * @returns {Promise<Array>} List of bookings
 */
export const getBookings = async () => {
    const { data, error } = await supabase
        .from('bookings')
        .select(`
            *,
            clinics (
                name,
                address
            )
        `)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
};

/**
 * Sign up a new user.
 */
export const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data;
};

/**
 * Sign in an existing user.
 */
export const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
};

/**
 * Sign out the current user.
 */
export const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
};

/**
 * Get the current user session.
 */
export const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
};

/**
 * Fetch bookings for the logged-in user.
 */
export const getMyBookings = async (userId) => {
    const { data, error } = await supabase
        .from('bookings')
        .select(`
            *,
            clinics (
                name,
                address
            )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
};

/**
 * Fetch interaction logs for a specific booking.
 */
export const getInteractionLog = async (bookingId) => {
    const { data, error } = await supabase
        .from('interaction_logs')
        .select('*')
        .eq('booking_id', bookingId)
        .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is code for no rows found
    return data;
};
