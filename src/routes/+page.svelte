<script>
    let { form } = $props();
</script>

<svelte:head>
    <title>2FA Login</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-slate-50 px-4">

    <div class="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-10 shadow-xl">

        <!-- Icon -->
        <div class="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-600 text-2xl font-bold text-white">
            ✓
        </div>

        <!-- Title -->
        <h1 class="text-center text-3xl font-bold text-slate-900">
            Willkommen zurück
        </h1>

        <p class="mt-2 text-center text-sm leading-6 text-slate-500">
            Melde dich sicher mit Zwei-Faktor-Authentifizierung an.
        </p>

        <!-- Form -->
        <form method="POST" class="mt-8 space-y-5">

            <div>
                <label
                    for="email"
                    class="mb-2 block text-sm font-semibold text-slate-700"
                >
                    E-Mail-Adresse
                </label>

                <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    autocomplete="email"
                    required
                    class="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
            </div>

            <div>
                <label
                    for="password"
                    class="mb-2 block text-sm font-semibold text-slate-700"
                >
                    Passwort
                </label>

                <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Passwort eingeben"
                    autocomplete="current-password"
                    required
                    class="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
            </div>

            <!-- Show an error message if the login fails -->
            {#if form?.error}
                <div class="rounded-lg bg-red-50 px-4 py-3 text-center text-sm text-red-700">
                    {form.error}
                </div>
            {/if}

            <button
                type="submit"
                class="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 active:scale-[0.99]"
            >
                Anmelden
             
            </button>

        </form>

        <!-- Security info -->
        <div class="mt-8 flex items-center justify-center gap-2 border-t border-slate-200 pt-5 text-xs text-slate-500">
            <span>Geschützt durch Zwei-Faktor-Authentifizierung</span>
        </div>

    </div>

</div>