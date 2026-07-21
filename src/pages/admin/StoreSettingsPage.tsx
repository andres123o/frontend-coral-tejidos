import { useEffect, useState } from "react";

import ImageUploader from "../../components/admin/ImageUploader";
import { Button, Card, Field, PageHeader, Textarea } from "../../components/admin/ui";
import { updateStoreSettings } from "../../lib/adminApi";
import { getStoreSettings } from "../../lib/api";

export default function StoreSettingsPage() {
  const [desktopUrl, setDesktopUrl] = useState<string | null>(null);
  const [mobileUrl, setMobileUrl] = useState<string | null>(null);
  const [shippingInfo, setShippingInfo] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getStoreSettings()
      .then((s) => {
        setDesktopUrl(s.featured_image_desktop_url);
        setMobileUrl(s.featured_image_mobile_url);
        setShippingInfo(s.shipping_info ?? "");
      })
      .catch(() => setError("No pudimos cargar la configuración."))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      await updateStoreSettings({
        featured_image_desktop_url: desktopUrl,
        featured_image_mobile_url: mobileUrl,
        shipping_info: shippingInfo,
      });
      setSaved(true);
    } catch {
      setError("No pudimos guardar los cambios.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-sm text-ink/60">Cargando…</p>;

  return (
    <div>
      <PageHeader
        title="Destacado y envíos"
        description='Estas imágenes son de campaña (estilo de vida), no se les quita el fondo. El producto destacado se elige marcando "Destacado" en la ficha de un producto.'
      />

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      {saved && <p className="mt-4 text-sm text-ink/60">Guardado.</p>}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <ImageUploader
            label="Imagen de escritorio (21:9)"
            images={desktopUrl ? [desktopUrl] : []}
            onChange={(images) => setDesktopUrl(images[images.length - 1] ?? null)}
            removeBackground={false}
            multiple={false}
          />
        </Card>

        <Card>
          <ImageUploader
            label="Imagen de celular (4:5)"
            images={mobileUrl ? [mobileUrl] : []}
            onChange={(images) => setMobileUrl(images[images.length - 1] ?? null)}
            removeBackground={false}
            multiple={false}
          />
        </Card>
      </div>

      <Card className="mt-6">
        <Field label="Envíos y cambios" hint="Este texto se muestra en la página de cada producto.">
          <Textarea
            value={shippingInfo}
            onChange={(e) => setShippingInfo(e.target.value)}
            rows={3}
            placeholder="Ej. Envíos: 2–4 días hábiles a nivel nacional · Cambios: hasta 5 días después de recibido."
          />
        </Field>
      </Card>

      <div className="mt-6 flex justify-end">
        <Button type="button" onClick={handleSave} disabled={saving}>
          {saving ? "Guardando…" : "Guardar"}
        </Button>
      </div>
    </div>
  );
}
