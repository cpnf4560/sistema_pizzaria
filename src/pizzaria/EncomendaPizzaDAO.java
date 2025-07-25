package pizzaria;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.math.BigDecimal;

public class EncomendaPizzaDAO {
    private Connection conn;

    public EncomendaPizzaDAO(Connection conn) {
        this.conn = conn;
    }

    public void inserirEncomendaPizza(EncomendaPizza ep) throws SQLException {
        String sql = "INSERT INTO encomenda_pizzas (encomenda_id, pizza_id, tamanho, preco) VALUES (?, ?, ?, ?)";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, ep.getEncomendaId());
            ps.setInt(2, ep.getPizzaId());
            ps.setString(3, ep.getTamanho());
            ps.setBigDecimal(4, ep.getPreco());
            ps.executeUpdate();
        }
    }

    public List<EncomendaPizza> getPizzasPorEncomenda(int encomendaId) throws SQLException {
        List<EncomendaPizza> lista = new ArrayList<>();
        String sql = "SELECT * FROM encomenda_pizzas WHERE encomenda_id = ?";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, encomendaId);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                EncomendaPizza ep = new EncomendaPizza(
                    rs.getInt("id"),
                    rs.getInt("encomenda_id"),
                    rs.getInt("pizza_id"),
                    rs.getString("tamanho"),
                    rs.getBigDecimal("preco")
                );
                lista.add(ep);
            }
        }
        return lista;
    }

    public boolean removerEncomendaPizza(int id) throws SQLException {
        String sql = "DELETE FROM encomenda_pizzas WHERE id = ?";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, id);
            int rows = ps.executeUpdate();
            return rows > 0;
        }
    }

    public boolean atualizarEncomendaPizza(EncomendaPizza ep) throws SQLException {
        String sql = "UPDATE encomenda_pizzas SET tamanho = ?, preco = ? WHERE id = ?";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, ep.getTamanho());
            ps.setBigDecimal(2, ep.getPreco());
            ps.setInt(3, ep.getId());
            int rows = ps.executeUpdate();
            return rows > 0;
        }
    }
}