export default {
  template: `
    <div class="q-gutter-lg">

      <q-card>
        <q-card-section class="text-h6">KShape</q-card-section>
        <q-separator />
        <q-card-section class="row q-gutter-md items-center">
          <k-shape :options="{ shape: 'circle', size: [32, 32] }" tooltip="Circle" />
          <k-shape :options="{ shape: 'rect', size: [32, 32] }" tooltip="Rect" />
          <k-shape :options="{ shape: 'diamond', size: [32, 32] }" tooltip="Diamond" />
          <k-shape :options="{ shape: 'triangle', size: [32, 32] }" tooltip="Triangle" />
          <k-shape :options="{ shape: 'star5', size: [32, 32] }" tooltip="Star" />
          <k-shape :options="{ shape: 'hexagon', size: [32, 32] }" tooltip="Hexagon" />
        </q-card-section>
      </q-card>

      <q-card style="width: 300px; height: 160px; position: relative; overflow: hidden;">
        <q-card-section class="text-h6">KRibbon</q-card-section>
        <q-separator />
        <q-card-section>Some card content</q-card-section>
        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; pointer-events: none;">
          <k-ribbon text="Beta" position="top-right" :origin="[40, 40]" style="pointer-events: auto;" />
        </div>
      </q-card>

      <q-card>
        <q-card-section class="text-h6">KColorScale — continuous horizontal</q-card-section>
        <q-separator />
        <q-card-section style="height: 80px;">
          <k-color-scale label="Temperature" colors="RdYlBu" :domain="[-20, 40]" />
        </q-card-section>
      </q-card>

      <q-card>
        <q-card-section class="text-h6">KColorScale — discrete horizontal</q-card-section>
        <q-separator />
        <q-card-section style="height: 80px;">
          <k-color-scale label="Elevation" colors="OrRd" :domain="[0, 3000]" :classes="[0, 500, 1000, 2000, 3000]" />
        </q-card-section>
      </q-card>

      <q-card>
        <q-card-section class="text-h6">KColorScale — continuous vertical</q-card-section>
        <q-separator />
        <q-card-section style="width: 120px; height: 200px;">
          <k-color-scale label="Wind" colors="Viridis" :domain="[0, 30]" direction="vertical" />
        </q-card-section>
      </q-card>

    </div>
  `
}
