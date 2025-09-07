package br.com.api.passit.services;

import br.com.api.passit.db.Items;
import br.com.api.passit.db.ItemsRepository;
import br.com.api.passit.db.UsersRepository;
import br.com.api.passit.exceptions.FlowException;
import br.com.api.passit.mappers.ItemsMapper;
import br.com.api.passit.to.GetItemsRequestTO;
import br.com.api.passit.to.GetItemsResponseTO;
import br.com.api.passit.to.ItemsRequestTO;
import br.com.api.passit.to.ItemsResponseTO;
import br.com.api.passit.to.OrderEnum;
import br.com.api.passit.to.SortItemEnum;
import jakarta.persistence.EntityManager;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Order;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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

    public GetItemsResponseTO get(GetItemsRequestTO request) {
        List<ItemsResponseTO> itemsResponse = new ArrayList<>();
        var criteriaBuilder = entityManager.getCriteriaBuilder();
        var criteriaQuery = criteriaBuilder.createQuery(Items.class);
        var root = criteriaQuery.from(Items.class);
        var predicates = buildPredicate(criteriaBuilder, root, request);
        var countQuery = buildCountQuery(predicates);
        if (countQuery.intValue() > 0) {
            criteriaQuery.where(criteriaBuilder.and(predicates.toArray(new Predicate[0])));
            criteriaQuery.orderBy(sortAndOrderToUsers(criteriaBuilder, root, request));
            var typedQuery = entityManager.createQuery(criteriaQuery);
            typedQuery.setFirstResult(request.offset());
            typedQuery.setMaxResults(request.limit());
            var items = typedQuery.getResultList();
            itemsResponse = buildGetItemsResponse(items);
        }
        return new GetItemsResponseTO(itemsResponse, countQuery.intValue());
    }

    private List<Predicate> buildPredicate(CriteriaBuilder criteriaBuilder, Root<Items> root, GetItemsRequestTO request) {
        var predicates = new ArrayList<Predicate>();
        if (request.title() != null && !request.title().isBlank()) {
            predicates.add(criteriaBuilder.equal(root.get("title"), "%" + request.title().toLowerCase() + "%"));
        }
        if (request.category() != null && !request.category().name().isBlank()) {
            predicates.add(criteriaBuilder.equal(root.get("category"), request.category().name()));
        }
        if (request.status() != null && !request.status().name().isBlank()) {
            predicates.add(criteriaBuilder.equal(root.get("status"), request.status().name()));
        }
        return predicates;
    }

    private Long buildCountQuery(List<Predicate> predicates) {
        var criteriaBuilder = entityManager.getCriteriaBuilder();
        var countQuery = criteriaBuilder.createQuery(Long.class);
        var root = countQuery.from(Items.class);
        countQuery.select(criteriaBuilder.count(root));
        if (!predicates.isEmpty()) {
            countQuery.where(criteriaBuilder.and(predicates.toArray(new Predicate[0])));
        }
        return entityManager.createQuery(countQuery).getSingleResult();
    }

    private Order sortAndOrderToUsers(CriteriaBuilder criteriaBuilder, Root<Items> root, GetItemsRequestTO request) {
        var sortFilter = request.sort();
        var orderFilter = request.order();
        if (sortFilter == null) sortFilter = SortItemEnum.TITLE;
        if (orderFilter == null) orderFilter = OrderEnum.DESC;
        return switch (sortFilter) {
            case CATEGORY ->
                    orderFilter == OrderEnum.ASC ? criteriaBuilder.asc(root.get("category")) : criteriaBuilder.desc(root.get("category"));
            case STATUS ->
                    orderFilter == OrderEnum.ASC ? criteriaBuilder.asc(root.get("status")) : criteriaBuilder.desc(root.get("status"));
            default ->
                    orderFilter == OrderEnum.ASC ? criteriaBuilder.asc(root.get("title")) : criteriaBuilder.desc(root.get("title"));
        };
    }

    private List<ItemsResponseTO> buildGetItemsResponse(List<Items> items) {
        return items.stream().map(itemsMapper::toResponse).toList();
    }
}
