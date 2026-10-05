import { redirect } from '@sveltejs/kit';

export function load({ cookies }) {
    const requestToken = cookies.get('verification_request');

    if (!requestToken) {
        throw redirect(303, '/');
    }
}