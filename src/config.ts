import { MainConfig, get, env } from "@brainhub/core-backend/lib/Config.js";
import { id } from "date-fns/locale";
import { brotliDecompress } from "zlib";

env();

export const db = {
  host: get("DRAGON3_PG_DB_HOST", "db.brainhub.pro"),
  port: get("DRAGON3_PG_DB_PORT", 5432),
  user: get("DRAGON3_PG_DB_USER", "brainhub"),
  password: get("DRAGON3_PG_DB_PASSWORD", ""),
  database: get("DRAGON3_PG_DB_NAME", "brainhub"),
  ssl: {
    rejectUnauthorized: false,
  },
};

export const mq = {
  hostname: get("RABBITMQ_ADDRESS", "rabbit.brainhub.pro").replace(/:\d+/, ""),
  username: get("RABBITMQ_USER", "guest"),
  password: get("RABBITMQ_PASSWORD", "guest"),
  vhost: get("RABBITMQ_VHOST", "guest"),
  log: get("RABBITMQ_LOG", true),
};

export const slack = {
  webhook_url: get(
    "SLACK_WEBHOOK_URL",
    "https://mattermost.brainhub.pro/hooks/ervtfyrnew"
  ), //zr63y3if8fbabdspbjz3ub8gde
  birthday_channel: get("SLACK_BIRTHDAY_CHANNEL", "#test2"),
};

export const sheets = {
  api_key: get(
    "SPREADSHEET_API_KEY",
    "AIzaSyC__U60scqGmwbLNhLlVg-suX4c-2GIcDk"
  ),
  sheets_id: get(
    "SPREADSHEET_ID",
    "1w4ZigpBkPE_BST3sQJZkqKa15FVyzMSiCoSa7n9h1_4"
  ),
  data_range: get("SPREADSHEET_DATA_RANGE", "Bot!A2:C1000"),
};

export const server = {
  host: get("HOST", "0.0.0.0"),
  port: get("PORT", 8000),
};

export const api = {
  timeout: 30000,
};

export const logging = {
  logstash: `tcp://${get("LOGSTASH_ADDRESS", "elk1.codabra.dev:12202")}`,
  prefix: "Brainhub",
  print: true,
};

export const dev = {
  debug: get("DEBUG", false),
};
export const dragon = {
  // eyJhbGciOiJSU0EtT0FFUC0yNTYiLCJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIiwidHlwIjoiSldUIn0.jBES1PmNG09MoJ14NRbEeq7PphMow1Q42uShmBfBWguxkL3KLQzpQqFk0m2wmYdwNkf9-YDyWvmUy45zkCGvGbcAiarzMudU0Hiu7jUw4YN-9692ETYkTv-zGI28u659VCZQbuw4S97DmpWsoaO1fuhHqyarB2nZRNawG7s9YCq6RwDkvbtaO2NvqjvtjvjyVo1qTpBLyYfTI6YZAGbzLALWiBg0A4t3i5VlBUu7tsaeCuiHbusigbf43T_90L6Mxr8JCdeOEJPzrivXFQ75roFGPbqt4XcuzriqHNee1dqhxyMsrD7OlcKWqPrNymK8QdtbacF91Yogrz95Se8n7A.e8fEEsSecRkTsLvf.Ffvi8y2YQ51h_ywdktDPSoehJGuYvT2MsEm7nUQTb7QhNFHSD3HCmNU9FxESRqxJqXN3kiyGXEbYbpTTJANWVQWUYD_Y-lcKRD4bE0bFFoD2bUrKeZPDzjQ0B_5kpk73k7uvNrULBtRT16C-_Q4DuIbhdx6bCz4cu_yb3fs7H52LDzDM_1Se8zsYdADQx4HZOOV_MM_yi6qAe7JV0ON8oDjzflKOyXVQJmEiZbn2NPedg2e7IZGvhPAPQ9Nd9IEDrTiVQw4IM8ZaFi8aJCXN1hi8_rdGvw-K41M23HG4sYMGAseaNnb6tKmqiivY35G1e_vcXC-hf2RluGfvFmTzW9pxh776vKPZ-zVTRxFyU04UmWsLPDJr4hG_oUcSS1jF0tMYpTWUpkdj6m6JM8852u0JZpR_iJL9NkX5z6ouv-E-ryWUiNmt0DOdm7xIqhWcZnpuUSuIO0Z59GlYLZ_WiVif1NPAh-WKo68iKzXjBZ77PB7yOKzZZFuAWiVYcmRI1xytI2hQrHUhoK0MD2ur_qymK5PsZ9fC9R27cJ3WOfvSgeLssqSoA7PIEq-Toioqu62aaCPs_Vh5tz-ZJ74GsNmL21Jt0zpe0rr_RyKxzSHTqtjSFiVIo-zcAMTfBVoqQ-2mp8KP7GosdrtbAeDiuxtiAfO6VctcvFtJrt046jFxvz3WQhe84FiCSE2-7foIJ5fy2j-f0CyWpZ3IRwkuNLdLaqxegXFyAMQqNm1Jv2No4A7SHWBMl6hGQHTiqklne7-2Pcrwf93cYjmqwg_oL3VzfZ2jXOLfX4NWvcaVB395KneY4Ti1lFp-N4CgwMrGYr_C4A7qFPOKYZMrz_eyMgGR3MXBsjmGWhhJRlRLe2P_frNeX-EBQhr45ticXmEXsvbX2bx78bLzzNh5Vikqg1tHtE3f67kSxTmlFNNuTcFcBHDBGKPVToKONA-OvOH30503OIEzd8TGX9E4LbD23XWCVULpX8AD8wR75aO0qOg2soAWLMmIkIX7O8xETmzLTjQ_ld992xdgwgcoGU1GP9Aw3PPe1PhiTgM1dnV4eWPykBpo7VPV0DPbNdP1g4UBp5fxiANRnjDdKUOUieemHnLWBPvYQrGlCapOZn50j_Vv2o7EZwdmUfamooscThkf0dbv7BRJCgdZiyyYineBaPc3CR-OxN5KrZyvhWG5BTEsA_iLxV9FDsjor3104MubdRzbJUtC-EadJFUZqJsGRaecJzpoyh4OQ7EUnWEnfPGUuidpBfCnL-M0vHIo9WBK9ZbJxLt0HFerougFOmvh-F2i9Eaj3JPTevgnLLSlchUhK8afG8xSpGQbpphDS64ai023oGFFPLMUkZJke5-VOMwDa2aA0EzmEhQMdQagK_y-zSw1_CVv6duEceRxAytDr7n2INReGzs-R1647yJ_cQEh6fWPQWV3Q3B-aj6_DyjlsuzBG24v5Yi9wjaQpWyIZgScvUF5BaBIg6-39dDxGb4MBYbVjp1fXDS-qVSrAFiAi8_JMOIJtzX2bPZxFUcNOeiZhlqoIVZb-dJGrl-29NcT-81Vjqvmgpw5JFv0ZcrKLjiZVTQ7ulaYh198RjJFuzkrz2lxvn9xADF37H1A1KMcU29wjjmiFyVJ0l0Q4lEq1WF3Fa6I4Ra0anxwEiOf9LRGELgVcPJSn9dx7MlAwbU0fbDPx4ydaLzZtaQCPdgwZfgCT1hLhJJKfMH_ydLKrZiBBqscbN_Iiwpw7uwc4kRyBZWl_MZZOtww5PN5OxJiXQgXZ1fonv6_kOjoqglVW1XzZhipcVkkk0YO0OETZqUUHwtqYDBIEfa1BSxmZtvGKo95u_vq9fgP4KurqvSeGaS1WXJVBnW991d4Y_D7rBd06fDqOHpkSpiJGg0qgT_qb4Dw5aUp_oY2fDlQfQWF7riuujeECZb4z6Y-yMj3g9j7OwlBIxclzy6ZyzaEiffXdRiJBCh5gCllpHm8DgCiaPAJtCOPcg1MTtnYMxW6y_iY5KinueJ72E5T_96q-D5Ppr8yATFhzxLxJRL3edgiDxrbOuKdWt69b6X2DUtLihzwYek6_MWi1Z6tuHdgWQ9vMGYB52j2nVymPNrHhgkSNYAT_yrtrVLa35nq37-Es31Lys8tmwkl9wjKXicFLE7DmE_Aj1RG7ky-ZRXMLHn2ORxIaEJg4GrI5e2mbWVQ9ntny5RV45Y0A3BALE2h5vEhWmAz6haFA-huCp8VH83drjx1-KTE5_JDvns0t9G6RReHkEi3Uv0hUwJsQqXW140iet4z29ptGTbQgN__feW3jtkpI0Xmch5n8Fk6SLMh70nWlzRAaNyxTjhJGK0REbEb7RocdO-JaCJrbAS_dyRKwSVo476RGK7t4BNIueNiE5wB.Jx9OgtfB1eQ6_VTDYv9qLQ
  token: get(
    "DRAGON_BEARER_TOKEN",
    "eyJhbGciOiJSU0EtT0FFUC0yNTYiLCJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIiwidHlwIjoiSldUIn0.mlQOGkAr53xKq0-MGDc2dZGv7eUPK21YlVaLliZS1mEs2W8tsqdixUhJEHHEyGvDNhvf4OGetVkIbR1QU7nuld-Fwjv-n9WpV13ARIpFhbfIL42_3OGsnIsBWv8ZtfegEzBjwPZ1GMdcATf0t_NlWyNUKKl0Q5Kd3AkHfbHsethQfxZL8DBKGKKzD0B2Sb4HWicZZp9el_A57LtlMktGwFFy_pE-qzRSmBsHH9ND4ExkZoHL5Ja2XkOQJTnbPoDo00aEd10tB8cxkrwipcrDV0jbvb1RZb1yzb6HdhLvb6Ov5cE_T3diNTi7_j7Jt7LBv15VdGSE0fgInuNLOyjfHA.Qv4uwjOaxM0YJx7t.rV9pQtAeeHTAIePThnpTta0SgkTmsE9SezZVGF62lXLhADogUJAnLOwx6oo2hEYmOVCDEoC2-xaI1FjCloB0oVa-hzTWKSllyld5fqypR8lp7bKrI6wK3wpXuFdRCHefsn_n_xLw8A9VNKoQZhHTsT2bi1pirEM45SW92UihXFMw2qIj0GdrMzx_ALh6I8EhQ5PYmnzfijleBC-xVFX-iTtNQyDaWgWIeca7BGIlDcQSdSKYxgMAcIkVoWTTRc4NX1SX-J0E7BL_5lBxTHXdTnKvzjut7_KzCDZxchZuaeTPcQe5r_VCOEHl76H5dV2ws_2y3mZ2ctl88KkzZ5gcyc9imgstr2L8GxYvhytHdlpOJwGtQcTRPtNBeEYhnwGZN7uj5e9LiqS6uGSbpstsrW3EV67yVmYp9aQpv1RE65m-yS5mMwnaUlYubd0_leLD8lbKNuntZ3kYoCzajKc31I1xgWlgPGYPDMxy3copMEf-jb3l7z0PP30M-Wcy-ihUfA7kImnIFzDtzeIkFiIW6IKlF13Ap6dnmELX_8c6te-DrGyW9TH9Gol2x7ww60ofc8lbQIfTr4Dt05r5MCBCQmTRBkdkplEv7U6xl2i6_YkiJCLKmbhFnHxc4fdb0Wze856rYokqYZW2ZkFEB9oOZ_5JKp32GMhmrZSYEPcHNrDRRp7gVQhlgls6CYoUXM1WDdz6pGZzuNgmDm58RDOsD1F7bNXr4F865Q3CTIeey_fxrpwZkRT2DwNnWSYIFCPrJFYohc5Br9GetiFVc4Z7iZZtsSPA0QhwtroPzqupXxWDnWsvFT0yXj_dGuWq0GrgFTiriN3vKizMFMWQOiFMAdUdsdNQH_vrPaEVED6cKcF45ttuWN_kg_7-todNq7zsiwDTloLYtsw7Fyp4mOuA41vWtxEn63QVvutZd6BYtGhHtCH6O3zaoEyv2l8DqkSsb31xG811Qqcmy11Ih8xriZ36FOURIONgZE2zk0s66LRKBIsZKsfd2ZGeMx0N4wE4CpmxCmxwb0rBu3nzXqL_Yh20-a12RO243lRGONenPwlwfFLqCCh8l6ChZgzN5Qva1bpny3bnaK8Acn-vS6phf7QpK_rp1D-uisvzsxqLqtlWO5dxNnCTyVE4RDmd3YG8SpTHO6Z_yw3-0n_1S2GtiKy6KO-fKBZJTTx04BLabCoboak_4cjagnNwMX7jC34fD5og9j-M_zzbbTt5stNRHcg6wB6hRAIpe9cIdlGHay3urnLsv1RkaII2CfrniDniqYAW82-Cct9MJVnnKyTQ7xSo0FuYSefAeuaxsa_9hGKa5YRtY4Io5LLejjrBPSkkfloPzezuXW2LwnsVd21Rzs4QYKkYSu8opFm0gKDcuQZEkQHMu90LL4jNA-TNxGzECx_ESX1MwEgRn7HSSdFqKz73X3YhjZzQnUPRr-XwRlDMJFsO0wKLq4-gRk1qtEcNl4BJBRLNvbJj-bXM9lwPcVs2xKvhjEOx03BAt2lybfZpAiSPlvPGVUBUef883UeJNj0q651OznPlQXoLaKotZVsjVou3nCBa0rhsAXpCf0On7_8fQ60Fhnyji1TCBH9BD-WOo4RnOyPeaxSbEpfliUZMyayEdDlUuH4CKFdAZ3dpmTWJxN_kGB9Xr3yanG6X_7dqeZFbe2cE-iRrx3s0J9VQimcJiu5gNFHvFzcHsHQBFnGwX7m5qZ6xT5il1vRkHURavLYoXc7tVLqYvbpBKcxoXf4Zqaqt8mfDDVOLS7jw9ynjMEfCAEGm8Bc9jUZjUHEtw0sTRuQsqpESFWZJEUBrn4pvt0fa3xzd-ud83tPS94kZ2ZnkAcagGwRU9c6FcVQj9iDVk3VOhtk8IcvvW4vMR0HHw-cZCLvhbux72YVtCRRYbYxZdr5eaI3wwGvBzitqqAsnNkOYwm6TDbOOx3VPh7fHYJbKRjV2xkKFrfJE70zPdEJ5mCYtk5IFjo116HUTkr5p7VYpvOIsipeLJodJOMn_XlCd4U_n9dwqjcEAtA7LClLa583RWhSBjnpzo46IRc4Kozo5umzsNaCivtg8_IXPXCleCz0E6w3JoBRa-7-l7OzjAyXym-DxfBWM237vu3l_Okp9siIOHA1we0wXVtUANmb8O7HuWdP22SDngJ60ZBlA2mTrqOUeLj9yKx_5ppo7duKoiEMmIwaJbpmQJ_TJsk7Tv0Ra_HQVFpHwAuX6nTxhDEIQaL-x-bFiockf06ChxiP1aSzfBKW8V1HT3PECjgejAFcQPEJcvWUJxEv-_TIYpHGlrWfaE65tJoGKCSDX3DP2T3byMTVJOVxPJc-Mn4uyP03-jgog2zQI8CZ2o6fycqm0rT3QaTuVxgjVWPZbRdFPMqgFDIgWR9BV.QM68FNKNbWzU3Yxx4fftDQ"
  ),
  // refreshT

  // token: set()
};
export const mattermost = {
  botID: get("BOT_ID", "71a7yfsbb3yyx83cuesbqpibee"),
  accessToken: get("MATTERMOST_ACCESS_TOKEN", "1mb1mj3u6brw3koy784m8534xo"),
  refreshToken: get("MATTERMOST_REFRESH_TOKEN", "1mb1mj3u6brw3koy784m8534xo"),
};

type Config = MainConfig<{
  db: typeof db;
  mq: typeof mq;
  slack: typeof slack;
  sheets: typeof sheets;
  server: typeof server;
  api: typeof api;
  logging: typeof logging;
  dev: typeof dev;
  dragon: typeof dragon;
  mattermost: typeof mattermost;
}>;

const app: Config = {
  service_name: "schedule-status-bot",
  app_name: "brainhub.schedule-status-bot",
  app_host: get("DOCKER_NODE", "localhost"),
  app_instance: get("DOCKER_INSTANCE", "0"),
  build_number: get("BUILD_NUMBER", <string | number>Date.now()),
  env: get("env", "local"),
  version: get("VERSION", null),

  db,
  mq,
  slack,
  sheets,
  server,
  api,
  logging,
  dev,
  dragon,
  mattermost,
};

export default app;
