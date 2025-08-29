package br.com.api.passit.services;

import br.com.api.passit.db.Items;
import br.com.api.passit.db.ItemsRepository;
import br.com.api.passit.db.Users;
import br.com.api.passit.db.UsersRepository;
import br.com.api.passit.exceptions.FlowException;
import br.com.api.passit.mappers.AddressesMapper;
import br.com.api.passit.mappers.ItemsMapper;
import br.com.api.passit.mappers.UsersMapper;
import br.com.api.passit.to.GetUsersRequestTO;
import br.com.api.passit.to.GetUsersResponseTO;
import br.com.api.passit.to.ItemsRequestTO;
import br.com.api.passit.to.ItemsResponseTO;
import br.com.api.passit.to.OrderEnum;
import br.com.api.passit.to.SortUserEnum;
import br.com.api.passit.to.UsersRequestTO;
import br.com.api.passit.to.UsersResponseTO;
import jakarta.persistence.EntityManager;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Order;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ItemsServices {

    private final ItemsRepository itemsRepository;
    private final UsersRepository usersRepository;
    private final ItemsMapper itemsMapper;
    private final EntityManager entityManager;

    @Transactional
    public ItemsResponseTO create(ItemsRequestTO request, UUID  userId) {
        var userById = usersRepository.findById(userId);
        if (userById.isEmpty()) {
            throw new FlowException("User not found.", HttpStatus.NOT_FOUND);
        }
        var itemEntity = itemsMapper.toEntity(request);
        itemEntity.setUser(userById.get());
        var item = itemsRepository.save(itemEntity);
        return itemsMapper.toResponse(item);
    }
}
