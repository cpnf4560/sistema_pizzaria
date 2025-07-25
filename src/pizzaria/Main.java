package pizzaria;

import javax.swing.SwingUtilities;

public class Main {
    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            PizzariaGUI gui = new PizzariaGUI();
            gui.setVisible(true);
        });
    }
}