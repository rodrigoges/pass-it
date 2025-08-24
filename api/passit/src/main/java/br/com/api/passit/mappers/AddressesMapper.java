package br.com.api.passit.mappers;

import br.com.api.passit.db.Addresses;
import br.com.api.passit.to.AddressesTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AddressesMapper {
    Addresses toEntity(AddressesTO dto);
}
