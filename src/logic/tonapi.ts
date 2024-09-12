import axios from "axios";

export interface GetAllJettonBalancesDtto {
  balances: JettonBalance;
}

interface JettonBalance {}

export interface GetHumanFriendlyInfoDto {
    addres: string;
    balance: number;
    last_activity: number;
    status: string;
    interfaces: string[][];
    name?: string;
    is_scam?: boolean;
    icon?: string;
    memo_required?: boolean;
    get_methods: string[];
    is_suspended?: boolean;
    is_wallet: boolean
}

export class TonApi {
  private _url = "https://tonapi.io/v2/";

  public async send(url: string, data: any): Promise<any | undefined> {
    const res = await axios.get(`${this._url}${url}?${new URLSearchParams(data)}`);
    if (res.data.error) {
        console.error(res.data)
        return undefined
    }
    return res.data
  }

  public async getHumanFriendlyInfoDto(account_id: string): Promise<GetHumanFriendlyInfoDto | undefined> {
    const data = await this.send(`accounts/${account_id}`, {})
    return data
  }
}
