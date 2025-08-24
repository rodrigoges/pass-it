package br.com.api.passit.to;

import br.com.api.passit.db.UserTypeEnum;

public record UsersResponseTO(
        String name,
        String email,
        String nationalIdentifier,
        UserTypeEnum userType,
        AddressesTO address
) {
}
