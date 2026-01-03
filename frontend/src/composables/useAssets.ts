import type { Asset, PriceHistory } from "@/api/intarfaces/asset";
import { useWebSocket } from "@/composables/useWebSocket";

export default function userAssets() {
  const { subscribe } = useWebSocket();

  const selectedAssetId = ref<number | null>(null);
  const updatedAsset = ref<Asset | null>(null);
  const needUpdatedAllAssets = ref<boolean>(false);
  const assetPrice = ref<number>(0);
  const history = ref<PriceHistory | null>(null);

  const subscribeToAsset = (assetId: number) => {
    subscribe("asset", assetId, `asset-update`, (data) => {
      console.log(`Прослушивание канала -  assets:${assetId}`, data);
      if (data.asset) {
        updatedAsset.value = data.asset;
        assetPrice.value = data.asset.price;
        history.value = data.price ?? null;
      }
    });
  };

  const subscribeToAssets = () => {
    subscribe(null, null, "assets-update", (data) => {
      console.log("Прослушивание канала - assets-update", data);
      if (data?.type === "assets-update") {
        needUpdatedAllAssets.value = true;
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
    needUpdatedAllAssets,
    assetPrice,
    history,
  };
}
