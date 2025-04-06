//TIP To <b>Run</b> code, press <shortcut actionId="Run"/> or
// click the <icon src="AllIcons.Actions.Execute"/> icon in the gutter.
public class Main {
    public static void main(String[] args) {

        Subject History = new Subject();

        ConcreteObserver student1 = new ConcreteObserver("Thiben");

        History.subscribe(student1);

        History.notification("Evening submit your home work");
    }
}