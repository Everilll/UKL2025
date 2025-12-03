import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

type PayLoad = {
    id: number,
    username: string,
    role: "ADMIN" | "DOSEN" | "MAHASISWA"
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(private config: ConfigService) {
        super({
            ignoreExpiration: false, // token punya masa expired nya
            secretOrKey: config.get<string>("secret_key") || "secret_key", // mendefinisikan secret key dari env
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken() // mengambil token dari header
        })
    }
    
    async validate(payload: PayLoad) {  // memberikan data identitas user saat tokennya valid
        return payload
    }
}