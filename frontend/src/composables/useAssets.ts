import { useWebSocket } from "@/composables/useWebSocket";
import { Asset, type PriceHistory } from "@/entities/Asset";

export default function userAssets() {
  const { subscribe } = useWebSocket();

  const selectedAssetId = ref<number | null>(null);
  const updatedAsset = ref<Asset | null>(null);
  const refrashAssets = ref<boolean>(false);
  const assetPrice = ref<number>(0);
  const history = ref<PriceHistory | null>(null);

  const subscribeToAsset = (assetId: number) => {
    subscribe("asset", assetId, `asset-update`, (data) => {
      console.log(`Прослушивание канала -  assets:${assetId}`, data);
      if (data.asset) {
        updatedAsset.value = new Asset(data.asset);
        assetPrice.value = data.asset.price;
        history.value = data.price ?? null;
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
    assetPrice,
    history,
  };
}
