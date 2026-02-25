import pool from '../database/db';

export async function getUserEmail(email: string): Promise<string | null> {
    try {
        const result = await pool.query(
            "SELECT email FROM users WHERE email = $1",
            [email]
        );
        
        if (result.rows.length > 0) {
            return result.rows[0].email;
        }
        return null;
    } catch (error) {
        console.error('Error fetching user email:', error);
        throw error;
    }
}

export async function getUserPassword(email: string): Promise<string | null> {
    try {
        const result = await pool.query(
            "SELECT password FROM users WHERE email = $1",
            [email]
        );
        
        if (result.rows.length > 0) {
            return result.rows[0].password;
        }
        return null;
    } catch (error) {
        console.error('Error fetching user password:', error);
        throw error;
    }
}