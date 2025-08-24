package br.com.api.passit.to;

import br.com.api.passit.db.UserTypeEnum;

public record UsersRequestTO(
        String name,
        String email,
        String password,
        String nationalIdentifier,
        UserTypeEnum userType,
        AddressesTO address
) {
}
