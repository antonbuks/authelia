import { UserInfoTOTPConfiguration, toEnum } from "@models/TOTPConfiguration";
import { UserInfoTOTPConfigurationPayload } from "@services/UserInfoTOTPConfiguration";

export function toUserInfoTOTPConfiguration(payload: UserInfoTOTPConfigurationPayload): UserInfoTOTPConfiguration {
    return {
        created_at: new Date(payload.created_at),
        last_used_at: payload.last_used_at ? new Date(payload.last_used_at) : undefined,
        issuer: payload.issuer,
        algorithm: toEnum(payload.algorithm),
        digits: payload.digits,
        period: payload.period,
    };
}
