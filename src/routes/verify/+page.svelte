<svelte:head>
    <title>2FA Verification</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-slate-50 px-4">

    <div class="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-10 shadow-xl">
        <h1 class="text-center text-3xl font-bold text-slate-900">
            Sicherheitscode
        </h1>

        <p class="mt-2 text-center text-sm leading-6 text-slate-500">
            Gib den 6-stelligen Code ein, um deine Anmeldung zu bestätigen.
        </p>


        <form method="POST" class="mt-8 space-y-5">

    <div>
        <label
            for="code"
            class="mb-2 block text-sm font-semibold text-slate-700"
        >
            Verifizierungscode
        </label>

        <input
            id="code"
            name="code"
            type="text"
            inputmode="numeric"
            maxlength="6"
            placeholder="000000"
            required
            class="w-full rounded-lg border border-slate-300 px-4 py-3 text-center text-2xl tracking-[0.5em] text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
    </div>

</form>

    </div>

</div>