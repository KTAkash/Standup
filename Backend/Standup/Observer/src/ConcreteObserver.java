public class ConcreteObserver implements Observer{

    private String Student_Name;

    public ConcreteObserver(String name) {
         Student_Name=name;
    }

    @Override
    public void update(String msg) {
        System.out.println(Student_Name + " received: " + msg);

    }
}
