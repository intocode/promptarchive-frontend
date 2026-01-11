import { SignOutAllDialog } from "@/components/settings/sign-out-all-dialog";

export default function SettingsPage(): React.ReactElement {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <p className="mt-2 text-muted-foreground">
        Manage your account settings.
      </p>

      <div className="mt-8 space-y-8">
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Security</h2>
          <div className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium">Sign out from all devices</p>
              <p className="text-sm text-muted-foreground">
                End all active sessions across all your devices
              </p>
            </div>
            <SignOutAllDialog />
          </div>
        </section>
      </div>
    </div>
  );
}
