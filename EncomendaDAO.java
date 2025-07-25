package pizzaria;

import java.sql.*;
import java.util.List;
import java.math.BigDecimal;

public class EncomendaDAO {
    public static int inserirEncomenda(Cliente cliente, Carrinho carrinho, String tipoEntrega, String hora, String observacoes) throws SQLException {
        String sql = "INSERT INTO encomendas (cliente_id, data_hora, tipo_entrega, taxa_entrega, observacoes) VALUES (?, NOW(), ?, ?, ?)";
        BigDecimal taxa = tipoEntrega.equalsIgnoreCase("Entrega") ? new BigDecimal("3.90") : BigDecimal.ZERO;

        try (Connection conn = ConexaoBD.ligar();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            ps.setInt(1, cliente.getId());
            ps.setString(2, tipoEntrega);
            ps.setBigDecimal(3, taxa);
            ps.setString(4, observacoes);

            ps.executeUpdate();
            ResultSet keys = ps.getGeneratedKeys();
            int idEncomenda = -1;
            if (keys.next()) {
                idEncomenda = keys.getInt(1);
            }

            // Inserir as pizzas do carrinho
            for (Carrinho.ItemCarrinho item : carrinho.getItens()) {
                String sqlPizza = "INSERT INTO encomenda_pizzas (encomenda_id, pizza_id, tamanho, preco) VALUES (?, ?, ?, ?)";
                try (PreparedStatement psPizza = conn.prepareStatement(sqlPizza)) {
                    psPizza.setInt(1, idEncomenda);
                    psPizza.setInt(2, item.getPizza().getId());
                    psPizza.setString(3, item.getTamanho());
                    psPizza.setBigDecimal(4, item.getPrecoUnitario());
                    psPizza.executeUpdate();
                }
            }

            return idEncomenda;
        }
    }

    // Outros métodos como getEncomendaById podem ser estáticos também
}