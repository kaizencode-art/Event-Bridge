import { EventContract } from "./EventContractManager";
import { z } from 'zod';

export class EventBusError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "EventBusError";
    }
}

/**
 * Infos consommateur : on a besoin de savoir
 * - l'objet consumer lui-même
 * - le callback à appeler lors du emit
 */
interface ConsumerInfo {
    consumer: z.string();
    callback: (payload: any) => void;
}

/**
 * État interne pour chaque événement : 
 * - contract : (nom, maxConsumers)
 * - emitter : unique objet qui émet (ou null si pas encore défini)
 * - consumers : ensemble de { consumer, callback }
 * - blocked : true si on a dépassé la limite de consommateurs
 */
interface EventState {
    contract: EventContract;
    emitter: object | null;
    consumers: Set<ConsumerInfo>;
    blocked: boolean;
}

export class EventBus {

    private static instance: EventBus | null = null;

    /**
     * Méthode statique pour récupérer l'instance unique du bus.
     */
    public static get(): EventBus {
        if (!this.instance) {
            this.instance = new EventBus();
        }
        return this.instance;
    }

    // Empêche l'instanciation directe de l'extérieur
    private constructor() { }

    private events = new Map<string, EventState>();

    /**
     * consume : on inscrit un consommateur (obj + callback) pour le contrat donné.
     * - Si l'événement n'existe pas encore en interne, on l'initialise.
     * - Si on dépasse le maxConsumers, on bloque et on jette une erreur.
     */
    public consume(
        contract: EventContract,
        consumerObj: object,
        callback: (payload: any) => void
    ): void {
        const state = this.getOrCreateEvent(contract);

        if (state.blocked) {
            throw new EventBusError(
                `Événement "${contract.name}" est bloqué (maxConsumers dépassé).`
            );
        }

        // Vérifie si le même consommateur est déjà inscrit (optionnel)
        const alreadyRegistered = [...state.consumers].some(
            (info) => info.consumer === consumerObj
        );
        if (alreadyRegistered) {
            throw new EventBusError(
                `Ce consommateur est déjà inscrit à "${contract.name}".`
            );
        }

        state.consumers.add({ consumer: consumerObj, callback });

        if (state.consumers.size > state.contract.maxConsumers) {
            state.blocked = true;
            throw new EventBusError(
                `Dépassement de maxConsumers pour "${contract.name}". Événement bloqué.`
            );
        }
    }

    /**
     * emit : on émet un événement avec un payload depuis un "emitter" donné.
     * - Si c'est la première fois, on assigne l'emitter.
     * - Sinon, on vérifie que c'est bien le même objet.
     * - Si l'événement est bloqué, on jette une exception.
     * - On appelle le callback de chaque consommateur.
     */
    public emit(contract: EventContract, emitterObj: object, payload: any): void {
        const state = this.getOrCreateEvent(contract);

        if (state.blocked) {
            throw new EventBusError(
                `Impossible d'émettre "${contract.name}" car il est bloqué.`
            );
        }

        // Première émission => on fixe l'émetteur
        if (state.emitter === null) {
            state.emitter = emitterObj;
        } else if (state.emitter !== emitterObj) {
            throw new EventBusError(
                `Émetteur incompatible pour "${contract.name}". Un autre est déjà défini.`
            );
        }

        // Appel du callback de chaque consommateur
        for (const info of state.consumers) {
            info.callback(payload);
        }
    }

    /**
     * getOrCreateEvent : récupère l'état d'un événement si on l'a déjà,
     * sinon l'initialise (emitter = null, consumers = vide...).
     *
     * On crée ainsi automatiquement la place dans la Map,
     * sans exiger une déclaration préalable.
     * => Si tu veux forcer la déclaration préalable, enlève ce fallback !
     */
    private getOrCreateEvent(contract: EventContract): EventState {
        let state = this.events.get(contract.name);
        if (!state) {
            state = {
                contract,
                emitter: null,
                consumers: new Set(),
                blocked: false,
            };
            this.events.set(contract.name, state);
        }
        return state;
    }
}
