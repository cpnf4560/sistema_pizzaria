package pizzaria;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.math.BigDecimal;

public class PizzaDAO {

    public static Pizza getPizzaById(int id) throws SQLException {
        String sql = "SELECT * FROM pizza WHERE id = ?";
        try (Connection conn = ConexaoBD.ligar();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, id);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                return new Pizza(
                 rs.getInt("id"),
                 rs.getString("nome"),
                 rs.getString("descricao"),
                 rs.getBigDecimal("preco_pequena"),
                 rs.getBigDecimal("preco_media"),
                 rs.getBigDecimal("preco_grande")
                );
            }
        }
        return null;
    }

    public static List<Pizza> listarPizzas() throws SQLException {
        List<Pizza> pizzas = new ArrayList<>();
        String sql = "SELECT * FROM pizza";
        try (Connection conn = ConexaoBD.ligar();
             Statement st = conn.createStatement();
             ResultSet rs = st.executeQuery(sql)) {
            while (rs.next()) {
                pizzas.add(new Pizza(
                    rs.getInt("id"),
                    rs.getString("nome"),
                    rs.getString("descricao"),
                    rs.getBigDecimal("preco_pequena"),
                    rs.getBigDecimal("preco_media"),
                    rs.getBigDecimal("preco_grande")
                ));
            }
        }
        return pizzas;
    }
}