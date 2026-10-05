<svelte:head>
    <title>Dashboard</title>
</svelte:head>

<!-- Main dashboard container -->
<div class="flex min-h-screen items-center justify-center bg-slate-50 px-4">


    <!-- Dashboard card -->
    <div class="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-xl">

         <!-- Success icon -->
        <div class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-600">
            ✓
        </div>

        <h1 class="text-3xl font-bold text-slate-900">
            Anmeldung erfolgreich
        </h1>

 <!-- 2FA success message -->
        <p class="mt-3 text-sm leading-6 text-slate-500">
    Die Zwei-Faktor-Authentifizierung wurde erfolgreich abgeschlossen.
</p>


        <!-- Login status -->
<div class="mt-8 rounded-xl bg-slate-50 p-4">
    <p class="text-sm font-medium text-slate-700">
        Du bist jetzt sicher angemeldet.
    </p>


    <!-- Logout button -->
    <a
    href="/logout"
    class="mt-6 inline-block rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
>
    Abmelden
</a>

</div>



    </div>

</div>