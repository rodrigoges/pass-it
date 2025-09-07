package br.com.api.passit.services;

import br.com.api.passit.db.ItemsRepository;
import br.com.api.passit.db.UsersRepository;
import br.com.api.passit.exceptions.FlowException;
import br.com.api.passit.mappers.ItemsMapper;
import br.com.api.passit.to.ItemsRequestTO;
import br.com.api.passit.to.ItemsResponseTO;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ItemsServices {

    private final ItemsRepository itemsRepository;
    private final UsersRepository usersRepository;
    private final ItemsMapper itemsMapper;
    private final EntityManager entityManager;

    @Transactional
    public ItemsResponseTO create(ItemsRequestTO request, UUID userId) {
        var userById = usersRepository.findById(userId);
        if (userById.isEmpty()) {
            throw new FlowException("User not found.", HttpStatus.NOT_FOUND);
        }
        var itemEntity = itemsMapper.toEntity(request);
        itemEntity.setUser(userById.get());
        var item = itemsRepository.save(itemEntity);
        return itemsMapper.toResponse(item);
    }

    public ItemsResponseTO update(ItemsRequestTO request, UUID itemId, UUID userId) {
        var userById = usersRepository.findById(userId);
        if (userById.isEmpty()) {
            throw new FlowException("User not found.", HttpStatus.NOT_FOUND);
        }
        itemsRepository.findById(itemId).orElseThrow(() -> new FlowException("Item not found.", HttpStatus.NOT_FOUND));
        var itemEntity = itemsMapper.toEntity(request);
        itemEntity.setUser(userById.get());
        itemEntity.setItemId(itemId);
        var item = itemsRepository.save(itemEntity);
        return itemsMapper.toResponse(item);
    }
}
