<script>
    let { form } = $props();
</script>
<svelte:head>
    <title>2FA Verification</title>
</svelte:head>

<!-- Main container for the verification page -->
<div class="flex min-h-screen items-center justify-center bg-slate-50 px-4">

     <!-- Verification card -->
    <div class="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-10 shadow-xl">
        <h1 class="text-center text-3xl font-bold text-slate-900">
            Sicherheitscode
        </h1>
    <!-- Instructions for the user -->
        <p class="mt-2 text-center text-sm leading-6 text-slate-500">
            Gib den 6-stelligen Code ein, um deine Anmeldung zu bestätigen.
        </p>

     <!-- Form for entering the 2FA code -->
        <form method="POST" class="mt-8 space-y-5">

<!-- Show an error message if the verification fails -->
{#if form?.error}
    <div class="rounded-lg bg-red-50 px-4 py-3 text-center text-sm text-red-700">
        {form.error}
    </div>
{/if}

    <div>

        <!-- Verification code label -->
        <label
            for="code"
            class="mb-2 block text-sm font-semibold text-slate-700"
        >
            Verifizierungscode
        </label>

         <!-- Input field for the 6-digit verification code -->
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


<!-- Submit the verification code -->
    <button type="submit" class="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700">Code bestätigen</button>

</form>

 <!-- Information about how long the code is valid -->
<div class="mt-8 border-t border-slate-200 pt-5 text-center text-xs text-slate-500">
    Der Sicherheitscode ist 5 Minuten gültig.
</div>

    </div>

</div>