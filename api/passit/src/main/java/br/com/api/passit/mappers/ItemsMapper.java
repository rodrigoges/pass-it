package br.com.api.passit.mappers;

import br.com.api.passit.db.Items;
import br.com.api.passit.to.ItemsRequestTO;
import br.com.api.passit.to.ItemsResponseTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ItemsMapper {

    @Mapping(source = "category", target = "category")
    @Mapping(source = "status", target = "status")
    Items toEntity(ItemsRequestTO dto);

    ItemsResponseTO toResponse(Items items);
}
