import { useState, useRef, useCallback, useMemo } from "react";
import { MYBinding } from "@/my-ui";
import { MushroomDataLoader } from "../services/MushroomDataLoader";
import { MushroomClusterEngine } from "../services/MushroomClusterEngine";
import { ClusterInfo } from "../models/ClusterInfo";

export function useMushroomViewModel() {
    const [repulsion, setRepulsionInternal] = useState<number>(2.0);
    const [isFetching, setIsFetching] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [isPhaseOneCompleted, setIsPhaseOneCompleted] = useState(false);
    const [clustersInfo, setClustersInfo] = useState<ClusterInfo[]>([]);
    const [currentProfit, setCurrentProfit] = useState<number | null>(null);

    const engineRef = useRef<MushroomClusterEngine | null>(null);

    const resetClusteringState = useCallback(() => {
        setClustersInfo([]);
        setCurrentProfit(null);
        setIsPhaseOneCompleted(false);
    }, []);

    const setRepulsion = useCallback((newValue: number) => {
        setRepulsionInternal(newValue);
        resetClusteringState();
    }, [resetClusteringState]);

    const repulsionBinding = useMemo(
        () => new MYBinding(() => repulsion, setRepulsion),
        [repulsion, setRepulsion]
    );

    const loadData = async () => {
        setIsFetching(true);
        setErrorMessage(null);
        try {
            const loader = new MushroomDataLoader();
            const transactions = await loader.fetchTransactions();
            engineRef.current = new MushroomClusterEngine(transactions);
            setIsDataLoaded(true);
            resetClusteringState();
        } catch (error: any) {
            setErrorMessage(`Ошибка загрузки: ${error.message || "Неизвестная ошибка"}`);
        } finally {
            setIsFetching(false);
        }
    };

    const runPhaseOne = async () => {
        setErrorMessage(null);
        try {
            if (!engineRef.current) {
                setErrorMessage("Требуется загрузка данных.");
                return;
            }
            
            // В JS это синхронная операция, но оставим асинхронную обертку, чтобы не блокировать UI надолго 
            // (в реальном приложении сложный просчет лучше уносить в WebWorker, но пока сойдет так)
            const result = engineRef.current.runPhaseOne(repulsion);
            setCurrentProfit(result.profit);
            setClustersInfo(result.clusters);
            setIsPhaseOneCompleted(true);
        } catch (error: any) {
            setErrorMessage(`Ошибка CLOPE: ${error.message || error}`);
        }
    };

    const runPhaseTwo = async () => {
        if (!isPhaseOneCompleted || !engineRef.current) return;
        
        const result = engineRef.current.runPhaseTwo();
        if (result) {
            setCurrentProfit(result.profit);
            setClustersInfo(result.clusters);
        }
    };

    return {
        repulsion: repulsionBinding,
        isFetching,
        errorMessage,
        isDataLoaded,
        isPhaseOneCompleted,
        clustersInfo,
        currentProfit,
        loadData,
        runPhaseOne,
        runPhaseTwo,
    };
}