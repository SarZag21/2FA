import { redirect } from '@sveltejs/kit';
 
export function load({ cookies }) {

    const sessionToken = cookies.get('session_token');
 
    if (!sessionToken) {

        throw redirect(303, '/');

    }

}
 