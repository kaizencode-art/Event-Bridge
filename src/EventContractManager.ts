export interface EventContract {
    name: string;
    maxConsumers: number;
  }
  
  export class EventContractManager {
    private static contracts = new Map<string, number>();
  
    /**
     * Ajoute un contrat pour un événement donné.
     */
    public static add(eventName: string, maxConsumers: number): void {
      if (this.contracts.has(eventName)) {
        throw new Error(`Le contrat pour "${eventName}" est déjà défini.`);
      }
      this.contracts.set(eventName, maxConsumers);
    }
  
    /**
     * Récupère le contrat associé à un nom d'événement.
     * Lève une erreur si l'événement n'a pas été enregistré.
     */
    public static get(eventName: string): EventContract {
      const max = this.contracts.get(eventName);
      if (max == null) {
        throw new Error(`Aucun contrat trouvé pour l'événement "${eventName}".`);
      }
      return { name: eventName, maxConsumers: max };
    }
  }
  