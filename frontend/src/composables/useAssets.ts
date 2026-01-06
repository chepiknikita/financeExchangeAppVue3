import { useWebSocket } from "@/composables/useWebSocket";
import { type IAsset, type PriceHistory } from "@/entities/Asset";

export default function useAssets() {
  const { subscribe } = useWebSocket();

  const selectedAssetId = ref<number | null>(null);
  const updatedAsset = ref<{ asset: IAsset; price: PriceHistory } | null>(null);
  const refrashAssets = ref<boolean>(false);

  const subscribeToAsset = (assetId: number) => {
    subscribe("asset", assetId, "asset-update", (data) => {
      console.log(`Прослушивание канала -  assets:${assetId}`, data);
      if (data) {
        updatedAsset.value = data;
      }
    });
  };

  const subscribeToAssets = () => {
    subscribe(null, null, "assets-update", (data) => {
      console.log("Прослушивание канала - assets-update", data);
      if (data?.type === "assets-update") {
        refrashAssets.value = true;
      }
    });
  };

  const selectAsset = (assetId: number) => {
    if (assetId) {
      selectedAssetId.value = assetId;
      subscribeToAsset(assetId);
    }
  };

  return {
    subscribeToAssets,
    selectAsset,
    updatedAsset,
    selectedAssetId,
    refrashAssets,
  };
}
