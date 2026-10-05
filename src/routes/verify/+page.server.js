import { fail, redirect } from '@sveltejs/kit';

export function load({ cookies }) {
    const requestToken = cookies.get('verification_request');

    if (!requestToken) {
        throw redirect(303, '/');
    }
}

export const actions = {
    default: async ({ request }) => {
        const formData = await request.formData();

        const code = formData.get('code')?.toString();

        if (!code || !/^\d{6}$/.test(code)) {
            return fail(400, {
                error: 'Bitte gib einen gültigen 6-stelligen Code ein.'
            });
        }

        return {
            success: true
        };
    }
};